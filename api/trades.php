<?php
session_start();

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'database.php';

// Check authentication
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Unauthorized. Please login.'
    ]);
    exit();
}

$user_id = $_SESSION['user_id'];

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        getTrades($db, $user_id);
        break;
    case 'POST':
        addTrade($db, $user_id);
        break;
    case 'DELETE':
        deleteTrade($db, $user_id);
        break;
    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        break;
}

function getTrades($db, $user_id) {
    try {
        $query = "SELECT * FROM trades WHERE user_id = :user_id ORDER BY date DESC, id DESC";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
        $stmt->execute();
        
        $trades = $stmt->fetchAll();
        
        echo json_encode([
            'success' => true,
            'trades' => $trades
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Error fetching trades: ' . $e->getMessage()
        ]);
    }
}

function addTrade($db, $user_id) {
    try {
        $data = json_decode(file_get_contents("php://input"), true);
        
        $query = "INSERT INTO trades (user_id, symbol, entry_price, exit_price, quantity, trade_type, pnl, date, notes) 
                  VALUES (:user_id, :symbol, :entry_price, :exit_price, :quantity, :trade_type, :pnl, :date, :notes)";
        
        $stmt = $db->prepare($query);
        
        $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
        $stmt->bindParam(':symbol', $data['symbol']);
        $stmt->bindParam(':entry_price', $data['entryPrice']);
        $stmt->bindParam(':exit_price', $data['exitPrice']);
        $stmt->bindParam(':quantity', $data['quantity']);
        $stmt->bindParam(':trade_type', $data['tradeType']);
        $stmt->bindParam(':pnl', $data['pnl']);
        $stmt->bindParam(':date', $data['date']);
        $stmt->bindParam(':notes', $data['notes']);
        
        if ($stmt->execute()) {
            echo json_encode([
                'success' => true,
                'message' => 'Trade added successfully',
                'id' => $db->lastInsertId()
            ]);
        } else {
            throw new Exception('Failed to add trade');
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Error adding trade: ' . $e->getMessage()
        ]);
    }
}

function deleteTrade($db, $user_id) {
    try {
        $data = json_decode(file_get_contents("php://input"), true);
        
        // Only allow deleting own trades
        $query = "DELETE FROM trades WHERE id = :id AND user_id = :user_id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $data['id']);
        $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
        
        if ($stmt->execute()) {
            if ($stmt->rowCount() > 0) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Trade deleted successfully'
                ]);
            } else {
                throw new Exception('Trade not found or unauthorized');
            }
        } else {
            throw new Exception('Failed to delete trade');
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Error deleting trade: ' . $e->getMessage()
        ]);
    }
}
?>
